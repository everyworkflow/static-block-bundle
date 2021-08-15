<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\Controller\Admin;

use EveryWorkflow\CoreBundle\Annotation\EWFRoute;
use EveryWorkflow\StaticBlockBundle\Repository\StaticBlockRepositoryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class SaveStaticBlockController extends AbstractController
{
    protected StaticBlockRepositoryInterface $staticBlockRepository;

    public function __construct(StaticBlockRepositoryInterface $staticBlockRepository)
    {
        $this->staticBlockRepository = $staticBlockRepository;
    }

    /**
     * @EWFRoute(
     *     admin_api_path="cms/static-block/{uuid}",
     *     defaults={"uuid"="create"},
     *     name="admin.cms.static_block.save",
     *     methods="POST"
     * )
     */
    public function __invoke(string $uuid, Request $request): JsonResponse
    {
        $submitData = json_decode($request->getContent(), true);

        if ('create' === $uuid) {
            if (isset($submitData['section_key'])) {
                try {
                    $itemByKey = $this->staticBlockRepository->findOne(['block_key' => $submitData['block_key']]);
                    if ($itemByKey) {
                        return (new JsonResponse())
                            ->setData([
                                'message' => "Static block with key '${submitData['block_key']}' already exists.",
                            ])
                            ->setStatusCode(JsonResponse::HTTP_BAD_REQUEST);
                    }
                } catch (\Exception $e) {
                    // ignore if section_key doesn't exist
                }
            }
            $section = $this->staticBlockRepository->getNewDocument($submitData);
        } else {
            $section = $this->staticBlockRepository->findById($uuid);
            foreach ($submitData as $key => $val) {
                $section->setData($key, $val);
            }
        }
        $result = $this->staticBlockRepository->save($section);

        if ($result->getUpsertedId()) {
            $section->setData('_id', $result->getUpsertedId());
        }

        return (new JsonResponse())->setData([
            'message' => 'Successfully saved changes.',
            'item' => $section->toArray(),
        ]);
    }
}
